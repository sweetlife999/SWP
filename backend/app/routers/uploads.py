import asyncio
import io
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

from app.auth import require_admin
from app.models.schemas import UploadOut

router = APIRouter(prefix="/admin/upload", tags=["upload"], dependencies=[Depends(require_admin)])

# Shared with the Thumbor container (FILE_LOADER_ROOT_PATH); see compose.yml.
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "/data/uploads")
# content-type → extension
ALLOWED = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
# content-type → the Pillow format name a genuine file of that type decodes as.
_EXPECTED_FORMAT = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
    "image/gif": "GIF",
}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB


def _verify_image(data: bytes, expected_format: str) -> None:
    """Decodes the actual image content — a spoofed Content-Type header alone
    would otherwise let any file through the extension allowlist."""
    try:
        with Image.open(io.BytesIO(data)) as img:
            img.verify()
        with Image.open(io.BytesIO(data)) as img:
            actual_format = img.format
    except UnidentifiedImageError as err:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="File is not a valid image",
        ) from err
    if actual_format != expected_format:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="File content does not match its declared type",
        )


@router.post("", response_model=UploadOut, status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile = File(...)) -> UploadOut:
    """Stores an uploaded image and returns its filename; serve it via Thumbor."""
    content_type = file.content_type or ""
    ext = ALLOWED.get(content_type)
    if ext is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPEG, PNG, WebP or GIF images are allowed",
        )
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image too large (max 5 MB)",
        )
    await asyncio.to_thread(_verify_image, data, _EXPECTED_FORMAT[content_type])
    name = f"{uuid.uuid4().hex}{ext}"

    def _write() -> None:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        with open(os.path.join(UPLOAD_DIR, name), "wb") as f:
            f.write(data)

    await asyncio.to_thread(_write)
    # Path is relative to Thumbor's FILE_LOADER_ROOT_PATH.
    return UploadOut(path=name)

import asyncio
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.auth import require_admin

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
MAX_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile = File(...)) -> dict:
    """Stores an uploaded image and returns its filename; serve it via Thumbor."""
    ext = ALLOWED.get(file.content_type or "")
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
    name = f"{uuid.uuid4().hex}{ext}"

    def _write() -> None:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        with open(os.path.join(UPLOAD_DIR, name), "wb") as f:
            f.write(data)

    await asyncio.to_thread(_write)
    # Path is relative to Thumbor's FILE_LOADER_ROOT_PATH.
    return {"path": name}

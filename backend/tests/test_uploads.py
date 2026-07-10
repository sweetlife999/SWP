"""Unit tests for app.routers.uploads._verify_image — magic-byte content validation."""

import io

import pytest
from fastapi import HTTPException
from PIL import Image

from app.routers.uploads import _verify_image


def _png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (4, 4), color="red").save(buf, format="PNG")
    return buf.getvalue()


def _jpeg_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (4, 4), color="blue").save(buf, format="JPEG")
    return buf.getvalue()


def test_accepts_genuine_image_matching_declared_type():
    _verify_image(_png_bytes(), "PNG")  # must not raise


def test_rejects_non_image_bytes():
    with pytest.raises(HTTPException) as exc:
        _verify_image(b"not an image, just some bytes", "PNG")
    assert exc.value.status_code == 415


def test_rejects_content_type_mismatch():
    # A real JPEG whose Content-Type header (and thus expected format) claimed PNG.
    with pytest.raises(HTTPException) as exc:
        _verify_image(_jpeg_bytes(), "PNG")
    assert exc.value.status_code == 415

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter
from io import BytesIO
from typing import List

router = APIRouter()

@router.post("/merge")
async def merge_pdfs(
    files: List[UploadFile] = File(...)
):
    print(
    f"Received {len(files)} files"
)

    merger = PdfWriter()

    for file in files:

        pdf_bytes = await file.read()

        merger.append(
            BytesIO(pdf_bytes)
        )

    output = BytesIO()

    merger.write(output)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=merged.pdf"
        }
    )
import io
import zipfile
import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from typing import List

router = APIRouter(
    prefix="/pdf",
    tags=["PDF Operations"]
)

@router.post("/compress")
async def compress_pdf(
    files: List[UploadFile] = File(...),  # 👈 Fixed: Now captures dynamic multiple file lists
    level: str = Form("medium")           # accepts: "low", "medium", "high"
):
    if not files:
        raise HTTPException(status_code=400, detail="No documents provided in upload matrix.")

    # Select compression parameters based on target choice profile
    if level == "low":
        jpeg_quality = 85
    elif level == "medium":
        jpeg_quality = 65
    else:
        jpeg_quality = 40

    def process_single_pdf(file_bytes: bytes) -> bytes:
        """Helper method to parse and compress a single PDF byte structure"""
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            
            for page in doc:
                image_list = page.get_images(full=True)
                for img_info in image_list:
                    xref = img_info[0]
                    try:
                        pix = fitz.Pixmap(doc, xref)
                        if pix.n - pix.alpha > 3:
                            pix = fitz.Pixmap(fitz.csRGB, pix)
                            
                        compressed_img_bytes = pix.tobytes("jpeg", jpeg_quality=jpeg_quality)
                        doc.replace_image(xref, stream=compressed_img_bytes, filename="optimized.jpg")
                    except Exception:
                        continue

            single_buffer = io.BytesIO()
            doc.save(single_buffer, garbage=4, deflate=True)
            doc.close()
            return single_buffer.getvalue()
        except Exception as e:
            raise ValueError(f"Processing node corrupted: {str(e)}")

    try:
        # ==========================================
        # CASE 1: Batch Process Multiple Documents
        # ==========================================
        if len(files) > 1:
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                for idx, upload_file in enumerate(files):
                    if not upload_file.filename.lower().endswith('.pdf'):
                        continue
                    
                    raw_bytes = await upload_file.read()
                    compressed_bytes = process_single_pdf(raw_bytes)
                    
                    filename = upload_file.filename if upload_file.filename else f"document_{idx+1}.pdf"
                    zip_file.writestr(f"compressed_{filename}", compressed_bytes)

            zip_buffer.seek(0)
            return StreamingResponse(
                zip_buffer,
                media_type="application/zip",
                headers={"Content-Disposition": "attachment; filename=compressed_collection.zip"}
            )

        # ==========================================
        # CASE 2: Process Single Isolated Document
        # ==========================================
        else:
            target_file = files[0]
            if not target_file.filename.lower().endswith('.pdf'):
                raise HTTPException(status_code=400, detail="Provided document is not a valid PDF format.")

            raw_bytes = await target_file.read()
            compressed_bytes = process_single_pdf(raw_bytes)
            
            output_buffer = io.BytesIO(compressed_bytes)
            return StreamingResponse(
                output_buffer,
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename=compressed_{target_file.filename}"}
            )

    except Exception as e:
        print(f"Server-side optimization failure track: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal engine failed processing: {str(e)}")

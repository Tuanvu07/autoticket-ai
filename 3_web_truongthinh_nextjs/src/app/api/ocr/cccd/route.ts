// ═══════════════════════════════════════════════════════════════
//  OCR GATEWAY: CCCD (Vietnamese ID Card) Extraction
//  ───────────────────────────────────────────────────────────────
//  Receives Base64 image from client, extracts data via:
//  - Mock mode (for testing locally)
//  - Real OCR services (FPT.AI, Google Cloud Vision, Zalo AI)
//  Returns normalized JSON with extracted fields.
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30; // 30-second timeout for OCR processing

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface CCCDData {
  name: string;
  cccd: string;
  dob: string; // DD/MM/YYYY
  address: string;
  gender?: string;
  nationality?: string;
}

interface OCRResponse {
  success: boolean;
  data?: CCCDData;
  error?: string;
  timestamp: number;
  processingTime: number;
}

// ─────────────────────────────────────────────────────────────
// MOCK OCR ENGINE (For testing without real API)
// ─────────────────────────────────────────────────────────────

async function mockOCRExtraction(base64Image: string): Promise<CCCDData> {
  // Simulate network + AI processing delay (1-2 seconds)
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 500));

  // Extract basic metadata from base64 header to validate it's an image
  if (!base64Image.startsWith("data:image")) {
    throw new Error("Invalid image format");
  }

  // Mock parsing logic: Return realistic demo data
  // In production, this would call FPT.AI, Google Vision, etc.
  const mockData: CCCDData = {
    name: "NGUYỄN QUỐC VINH",
    cccd: "079099010123",
    dob: "01/09/1999",
    address: "Quận 12, Thành phố Hồ Chí Minh",
    gender: "Nam",
    nationality: "Việt Nam",
  };

  return mockData;
}

// ─────────────────────────────────────────────────────────────
// REAL OCR IMPLEMENTATIONS (PLACEHOLDER ADAPTERS)
// ─────────────────────────────────────────────────────────────

/**
 * ADAPTER: FPT.AI Vision Service
 * https://api.fpt.ai/vision/idr/extract
 * Requires: OCR_API_KEY_FPTAI env variable
 */
async function fptAIOCR(base64Image: string): Promise<CCCDData> {
  const apiKey = process.env.OCR_API_KEY_FPTAI;
  if (!apiKey) {
    throw new Error("FPT.AI API key not configured");
  }

  const response = await fetch("https://api.fpt.ai/vision/idr/extract", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64Image.replace(/^data:image\/[a-z]+;base64,/, ""),
    }),
  });

  if (!response.ok) {
    throw new Error(`FPT.AI error: ${response.statusText}`);
  }

  const result = await response.json();

  // Parse FPT.AI response format
  // Expected: { data: { full_name, id_number, dob, address, ... } }
  return {
    name: result.data?.full_name || "Unknown",
    cccd: result.data?.id_number || "",
    dob: result.data?.dob || "",
    address: result.data?.address || "",
    gender: result.data?.gender || "",
    nationality: result.data?.nationality || "Việt Nam",
  };
}

/**
 * ADAPTER: Google Cloud Vision API
 * https://cloud.google.com/vision
 * Requires: GOOGLE_CLOUD_API_KEY env variable
 */
async function googleCloudVisionOCR(base64Image: string): Promise<CCCDData> {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  if (!apiKey) {
    throw new Error("Google Cloud Vision API key not configured");
  }

  const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageData },
            features: [
              { type: "TEXT_DETECTION" },
              { type: "DOCUMENT_TEXT_DETECTION" },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google Vision error: ${response.statusText}`);
  }

  const result = await response.json();
  const fullText =
    result.responses?.[0]?.fullTextAnnotation?.text || "";

  // Parse Vietnamese ID card OCR text (regex-based extraction)
  // This is a simplified example — production code needs robust parsing
  const nameMatch = fullText.match(/Họ và tên:?\s*([^\n]+)/i);
  const idMatch = fullText.match(/Số.*?:?\s*(\d{12})/);
  const dobMatch = fullText.match(/Ngày sinh:?\s*(\d{2}\/\d{2}\/\d{4})/i);
  const addressMatch = fullText.match(/Nơi cư trú:?\s*([^\n]+)/i);

  return {
    name: nameMatch?.[1]?.trim() || "Unknown",
    cccd: idMatch?.[1] || "",
    dob: dobMatch?.[1] || "",
    address: addressMatch?.[1]?.trim() || "",
    nationality: "Việt Nam",
  };
}

/**
 * ADAPTER: Zalo AI / ZaloAI OCR
 * https://zalo.ai/solutions/identity-document-recognition
 * Requires: OCR_API_KEY_ZALOAI env variable
 */
async function zaloAIOCR(base64Image: string): Promise<CCCDData> {
  const apiKey = process.env.OCR_API_KEY_ZALOAI;
  if (!apiKey) {
    throw new Error("Zalo AI API key not configured");
  }

  const response = await fetch("https://api.zalo.ai/v1/vision/idr/extract", {
    method: "POST",
    headers: {
      "apikey": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64Image.replace(/^data:image\/[a-z]+;base64,/, ""),
    }),
  });

  if (!response.ok) {
    throw new Error(`Zalo AI error: ${response.statusText}`);
  }

  const result = await response.json();

  return {
    name: result.data?.name || "Unknown",
    cccd: result.data?.id_number || "",
    dob: result.data?.dob || "",
    address: result.data?.address || "",
    gender: result.data?.gender || "",
    nationality: "Việt Nam",
  };
}

// ─────────────────────────────────────────────────────────────
// MAIN REQUEST HANDLER
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // 1. Parse incoming request
    const body = await request.json();
    const { image, provider = "mock" } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing or invalid 'image' field (must be Base64 string)",
          timestamp: Date.now(),
          processingTime: 0,
        } as OCRResponse,
        { status: 400 }
      );
    }

    // 2. Validate image size (should be < 1MB after compression)
    const imageSize = Buffer.byteLength(image, "utf8") / (1024 * 1024); // MB
    if (imageSize > 5) {
      return NextResponse.json(
        {
          success: false,
          error: `Image too large (${imageSize.toFixed(2)}MB). Max 5MB allowed.`,
          timestamp: Date.now(),
          processingTime: 0,
        } as OCRResponse,
        { status: 413 }
      );
    }

    // 3. Route to appropriate OCR provider
    let extractedData: CCCDData;

    if (provider === "fptai") {
      extractedData = await fptAIOCR(image);
    } else if (provider === "google") {
      extractedData = await googleCloudVisionOCR(image);
    } else if (provider === "zaloai") {
      extractedData = await zaloAIOCR(image);
    } else {
      // Default to mock (safe for development)
      extractedData = await mockOCRExtraction(image);
    }

    // 4. Validate extraction results
    if (!extractedData.name || !extractedData.cccd) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract CCCD data. Please try again with a clearer image.",
          timestamp: Date.now(),
          processingTime: Date.now() - startTime,
        } as OCRResponse,
        { status: 422 }
      );
    }

    // 5. Return success response
    return NextResponse.json(
      {
        success: true,
        data: extractedData,
        timestamp: Date.now(),
        processingTime: Date.now() - startTime,
      } as OCRResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("[OCR API Error]", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown OCR error",
        timestamp: Date.now(),
        processingTime: Date.now() - startTime,
      } as OCRResponse,
      { status: 500 }
    );
  }
}

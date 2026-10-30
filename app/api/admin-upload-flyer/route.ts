import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || user.email !== "ernestackom2@gmail.com") {
      return NextResponse.json(
        { error: "Not authorised" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No flyer selected" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload an image file" },
        { status: 400 }
      );
    }

    const fileName = `admin/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { data, error: uploadError } = await supabaseAdmin.storage
      .from("event-flyers")
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) {
  console.log("FLYER UPLOAD ERROR:", uploadError);
  return NextResponse.json(
    { error: uploadError.message },
    { status: 500 }
  );
}

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("event-flyers")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch {
    return NextResponse.json(
      { error: "Flyer upload failed" },
      { status: 500 }
    );
  }
}
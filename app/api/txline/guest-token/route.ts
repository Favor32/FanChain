
export async function GET(){
    const response = await fetch("https://txline-dev.txodds.com/auth/guest/start", {
    method: "POST"
    });

    const data = await response.json();

    return Response.json({ token: data.token });
}

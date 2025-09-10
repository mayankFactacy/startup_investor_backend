export async function callModel(data) {
    try {
        console.log("data is ",data);
        
        const response = await fetch("https://aimodel.startupinvestors.ai/api/v1/auth/recom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)

        })

        const result = await response.json();
        return result;
    } catch (error) {
        console.log("Model call failed:", error);
        return null;

    }
}

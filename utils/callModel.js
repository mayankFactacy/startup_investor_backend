async function callModel(data) {
    try {
        const response = await fetch("", {
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

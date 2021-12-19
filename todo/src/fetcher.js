export async function fetcher(url) {

    const response = await fetch("http://localhost:4000" + url)
    console.log(response.status)
    return response.json()
} 
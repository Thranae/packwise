export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.redirect('/shared/not-found');
  }

  try {
    // Determine the backend API URL. Vercel automatically exposes NEXT_PUBLIC or VITE_ prefixed vars to the edge/serverless if configured,
    // but in case it isn't, we can try to rely on a hardcoded fallback or the VITE_API_URL environment variable.
    // If the user didn't set VITE_API_URL for the serverless environment, this might fail, so we provide a safe fallback.
    const apiUrl = process.env.VITE_API_URL || process.env.API_URL || 'https://packwise-c35v.onrender.com/api'; // Guessing standard render URL if missing
    
    // Fetch the trip data from the public endpoint
    const response = await fetch(`${apiUrl}/trips/public/${id}`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data.success && data.data) {
        const trip = data.data;
        const title = `${trip.destination} Trip | Voyage Genie`;
        const description = `Check out this amazing ${trip.duration}-day trip to ${trip.destination}!`;
        const image = trip.heroImage || 'https://packwise-neon.vercel.app/og-image.png';
        
        const html = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>${title}</title>
              
              <!-- Open Graph / Facebook -->
              <meta property="og:type" content="website">
              <meta property="og:title" content="${title}">
              <meta property="og:description" content="${description}">
              <meta property="og:image" content="${image}">
              <meta property="og:image:width" content="1200">
              <meta property="og:image:height" content="630">
              
              <!-- Twitter -->
              <meta name="twitter:card" content="summary_large_image">
              <meta name="twitter:title" content="${title}">
              <meta name="twitter:description" content="${description}">
              <meta name="twitter:image" content="${image}">
              
              <script>
                // Instantly redirect real users to the actual React frontend route
                window.location.replace('/shared/${id}');
              </script>
            </head>
            <body style="background: #0B1120; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
              <p>Redirecting to Voyage Genie...</p>
            </body>
          </html>
        `;
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache the OG image html at the edge for 1 hour
        return res.status(200).send(html);
      }
    }
    
    // If anything fails (404, 500, parsing error), redirect to the React frontend anyway
    return res.redirect(`/shared/${id}`);
    
  } catch (error) {
    console.error("Vercel Share OG API Error:", error);
    // Safe fallback to let the React SPA handle the error state
    return res.redirect(`/shared/${id}`);
  }
}

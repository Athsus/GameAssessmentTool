export const updateRecommendationImage = async (id: number, imageUrl: string): Promise<void> => {
  try {
    const response = await fetch(`/api/recommendations/${id}/image`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating recommendation image:', error);
    throw error;
  }
}; 
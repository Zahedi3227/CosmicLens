const API_KEY = "e3HrsoSRFPcCDDQYTlH5p6Qzm15MEtMQNz7jB7K8";
const API_URL = "https://api.nasa.gov/planetary/apod";

export const fetchAPODData = async (date = null) => {
  const dateParam = date || formatDate(getRandomDate(new Date('1995-06-16'), new Date()));
  const response = await fetch(`${API_URL}?api_key=${API_KEY}&date=${dateParam}`);
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
}; 
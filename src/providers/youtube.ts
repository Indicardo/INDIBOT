import YouTube from "simple-youtube-api";
const youtube = new YouTube(process.env.GOOGLE_API_KEY);

export default youtube;

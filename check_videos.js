import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/swarnstree');

const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
  platform: String,
  thumbnail: String
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

async function check() {
  const videos = await Video.find();
  console.log(JSON.stringify(videos, null, 2));
  process.exit(0);
}
check();

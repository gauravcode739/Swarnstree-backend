import Video from '../models/Video.js';

export const createVideo = async (req, res) => {
  try {
    const videoData = { ...req.body };
    if (req.file) {
      videoData.url = req.file.path; // Cloudinary secure URL for uploaded video
    }
    
    if (!videoData.url) {
      return res.status(400).json({ success: false, message: 'Video URL or file is required' });
    }

    const video = new Video(videoData);
    const savedVideo = await video.save();
    res.status(201).json({ success: true, data: savedVideo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.url = req.file.path;
    }

    const video = await Video.findByIdAndUpdate(id, updateData, { new: true });
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

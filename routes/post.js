const express = require('express');
const Posts = require('../models/posts');
const router = express.Router();
const { isValidObjectId } = require('mongoose');

// Create a new post
router.post('/post', async (req, res) => {
  try {
    const {
      fullname,
      email,
      phonenumber,
      vehicaletype,
      vehicalenumber,
      selectservice,
      branch,
      fromdate,
      comments,
      userEmail
    } = req.body;

    console.log('\n[DB WRITE] Attempting to create new post...');
    console.log('[DB WRITE] Data received:', {
      fullname,
      email,
      phonenumber,
      vehicaletype,
      vehicalenumber,
      selectservice,
      branch,
      fromdate,
      comments: comments?.substring(0, 50) + '...' // Truncate long comments
    });

    // Check which fields are missing
    const missingFields = [];
    if (!fullname) missingFields.push('fullname');
    if (!email) missingFields.push('email');
    if (!phonenumber) missingFields.push('phonenumber');
    if (!vehicaletype) missingFields.push('vehicaletype');
    if (!vehicalenumber) missingFields.push('vehicalenumber');
    if (!selectservice) missingFields.push('selectservice');
    if (!branch) missingFields.push('branch');
    if (!fromdate) missingFields.push('fromdate');
    if (!comments) missingFields.push('comments');

    if (missingFields.length > 0) {
      console.log('[DB WRITE] Validation failed: Missing required fields');
      console.log('[DB WRITE] Missing fields:', missingFields.join(', '));
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
        missingFields: missingFields
      });
    }

    const newPost = {
      fullname,
      email,
      phonenumber,
      vehicaletype,
      vehicalenumber,
      selectservice,
      branch,
      fromdate,
      comments,
      status: 'pending', // Default status
      userEmail: userEmail || email // Use userEmail if provided, otherwise use email
    };

    console.log('[DB WRITE] Writing to database: Posts collection');
    const createdPost = await Posts.create(newPost);
    console.log('[DB WRITE] ✓ Post created successfully!');
    console.log('[DB WRITE] Post ID:', createdPost._id);
    console.log('[DB WRITE] Status: pending');
    console.log('[DB WRITE] User Email:', createdPost.userEmail);
    console.log('[DB WRITE] Created at:', new Date().toISOString());
    
    return res.status(201).json({
      success: true,
      data: createdPost // returning the created post
    });
  } catch (error) {
    console.error('[DB WRITE] ✗ Error creating post:', error.message);
    console.error(error);
    return res.status(500).json({
      success: false, // indicate the failure
      message: error.message
    });
  }
});


// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.find();
    return res.status(200).json({
      success: true,
      existingPosts: posts
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});
router.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the URL parameter
    const post = await Posts.findById(postId);

    if (!post) {
      // If the post doesn't exist, return a 404 Not Found response
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      post: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Delete a post by ID
router.delete('/post/:id', async (req, res) => {
  const { id } = req.params;

  console.log('\n[DB WRITE] Attempting to delete post...');
  console.log('[DB WRITE] Post ID:', id);

  if (!isValidObjectId(id)) {
    console.log('[DB WRITE] ✗ Validation failed: Invalid post ID format');
    return res.status(400).json({
      message: "Invalid post ID format"
    });
  }

  try {
    console.log('[DB WRITE] Deleting from database: Posts collection');
    const deletedPost = await Posts.findByIdAndDelete(id);
    
    if (!deletedPost) {
      console.log('[DB WRITE] ✗ Post not found in database');
      return res.status(404).json({
        message: "Post not found"
      });
    }
    console.log('[DB WRITE] ✓ Post deleted successfully!');
    console.log('[DB WRITE] Deleted post details:', {
      id: deletedPost._id,
      fullname: deletedPost.fullname,
      email: deletedPost.email
    });
    console.log('[DB WRITE] Deleted at:', new Date().toISOString());
    return res.status(204).send();
  } catch (error) {
    console.error('[DB WRITE] ✗ Error deleting post:', error.message);
    return res.status(500).json({
      message: "An error occurred while deleting the post",
      error: error.message
    });
  }
});

// Update a post by ID
router.put('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    console.log('\n[DB WRITE] Attempting to update post...');
    console.log('[DB WRITE] Post ID:', postId);
    console.log('[DB WRITE] Update data:', req.body);
    
    console.log('[DB WRITE] Updating in database: Posts collection');
    const updatedPost = await Posts.findByIdAndUpdate(postId, req.body, { new: true });
    
    if (!updatedPost) {
      console.log('[DB WRITE] ✗ Post not found in database');
      return res.status(404).json({
        message: "Post not found"
      });
    }
    console.log('[DB WRITE] ✓ Post updated successfully!');
    console.log('[DB WRITE] Updated post ID:', updatedPost._id);
    console.log('[DB WRITE] Updated at:', new Date().toISOString());
    
    return res.status(200).json({
      message: "Post updated successfully",
      updatedPost
    });
  } catch (error) {
    console.error('[DB WRITE] ✗ Error updating post:', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
});

// Approve a reservation
router.patch('/post/:id/approve', async (req, res) => {
  try {
    const postId = req.params.id;
    console.log('\n[DB WRITE] Attempting to approve reservation...');
    console.log('[DB WRITE] Post ID:', postId);

    if (!isValidObjectId(postId)) {
      console.log('[DB WRITE] ✗ Validation failed: Invalid post ID format');
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    console.log('[DB WRITE] Updating status to approved in database: Posts collection');
    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      { status: 'approved' },
      { new: true }
    );

    if (!updatedPost) {
      console.log('[DB WRITE] ✗ Post not found in database');
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    console.log('[DB WRITE] ✓ Reservation approved successfully!');
    console.log('[DB WRITE] Approved post ID:', updatedPost._id);
    console.log('[DB WRITE] User Email:', updatedPost.userEmail);
    console.log('[DB WRITE] Approved at:', new Date().toISOString());

    return res.status(200).json({
      success: true,
      message: "Reservation approved successfully",
      data: updatedPost
    });
  } catch (error) {
    console.error('[DB WRITE] ✗ Error approving reservation:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Reject a reservation
router.patch('/post/:id/reject', async (req, res) => {
  try {
    const postId = req.params.id;
    console.log('\n[DB WRITE] Attempting to reject reservation...');
    console.log('[DB WRITE] Post ID:', postId);

    if (!isValidObjectId(postId)) {
      console.log('[DB WRITE] ✗ Validation failed: Invalid post ID format');
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    console.log('[DB WRITE] Updating status to rejected in database: Posts collection');
    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      { status: 'rejected' },
      { new: true }
    );

    if (!updatedPost) {
      console.log('[DB WRITE] ✗ Post not found in database');
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    console.log('[DB WRITE] ✓ Reservation rejected successfully!');
    console.log('[DB WRITE] Rejected post ID:', updatedPost._id);
    console.log('[DB WRITE] User Email:', updatedPost.userEmail);
    console.log('[DB WRITE] Rejected at:', new Date().toISOString());

    return res.status(200).json({
      success: true,
      message: "Reservation rejected successfully",
      data: updatedPost
    });
  } catch (error) {
    console.error('[DB WRITE] ✗ Error rejecting reservation:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's own reservations
router.get('/posts/user/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    console.log('\n[DB READ] Fetching reservations for user:', userEmail);
    
    const posts = await Posts.find({ userEmail: userEmail }).sort({ createdAt: -1 });
    
    console.log('[DB READ] ✓ Found', posts.length, 'reservations for user');
    
    return res.status(200).json({
      success: true,
      existingPosts: posts
    });
  } catch (error) {
    console.error('[DB READ] ✗ Error fetching user reservations:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

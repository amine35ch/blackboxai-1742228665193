const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store submissions in memory (for demo purposes)
let submissions = [];

// API Routes
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Store the submission
        const newSubmission = {
            id: Date.now(),
            name,
            email,
            message,
            timestamp: new Date()
        };
        submissions.push(newSubmission);

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Form submitted successfully',
            data: newSubmission
        });
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request'
        });
    }
});

// Get all submissions (for demo purposes)
app.get('/api/submissions', (req, res) => {
    res.json({
        success: true,
        data: submissions
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

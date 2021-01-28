const express = require('express');
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile
        .findOne({user: req.user.id })
        .populate(
            'user', 
            ['name', 'avatar']
        );

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });

        }
        res.json(profile);
    } catch(err) {
        console.log(err.message);
        res.atatus(500).send('Server Error');
    }
});

// Update main user data
router.post(
    '/', 
    [
        auth, 
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
            check('skills', 'Skills is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // Build Profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = company;
        if(githubusername) profileFields.githubusername = githubusername;

        if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

        profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube;
        if(facebook) profileFields.social.facebook = facebook;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(linkedin) profileFields.social.linkedin = linkedin;

        try{
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set: profileFields },
                { new: true, upsert: true }
            )
            res.json(profile);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Update experience
router.post(
    '/experience', 
    [
        auth,
        [
            check('title', 'Title is required')
                .not()
                .isEmpty(),
            check('company', 'Company is required')
                .not()
                .isEmpty(),
            check('from', 'From date is required')
                .not()
                .isEmpty(),
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExperience = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExperience);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
});

// Delete experience
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});
// Update education
router.post(
    '/education', 
    [
        auth,
        [
            check('school', 'School is required')
                .not()
                .isEmpty(),
            check('degree', 'Degree is required')
                .not()
                .isEmpty(),
            check('fieldofstudy', 'Field of study is required')
                .not()
                .isEmpty(),
            check('from', 'From date is required')
                .not()
                .isEmpty(),
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEducation = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEducation);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
});

// Delete experience
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// Get Github repos of user
router.get('/github/:username', (req, res) => {
    try {
        const options = {
          uri: encodeURI(`https://api.github.com/users/${
            req.params.username
          }/repos?per_page=5&sort=created:asc&client_id=${config.get(
            'githubClientId'
          )}&client_secret=${config.get('githubSecretKey')}`),
          method: 'GET',
          headers: { 'user-agent': 'node.js' }
        };
    
        request(options, (error, response, body) => {
          if (error) console.error(error);
    
          if (response.statusCode !== 200) {
            return res.status(404).json({ msg: 'No Github profile found' });
          }
    
          res.json(JSON.parse(body));
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });
// Get profile by user id
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind = 'ObjectId') {
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
});

// Delete user
router.delete('/', auth, async (req, res) => {
    try {
        // Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({msg: 'User deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
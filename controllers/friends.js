const Friends = require('../models/Friends');
const Characterdata = require('../models/Characterdata');

// Add friend request
exports.addFriend = async (req, res) => {
    try {
        const { characterId, friendId } = req.body;

        // Check if characters exist
        const [character, friend] = await Promise.all([
            Characterdata.findById(characterId),
            Characterdata.findById(friendId)
        ]);

        if (!character || !friend) {
            return res.status(400).json({
                message: "failed",
                data: 'Character or friend not found'
            });
        }

        // Check if friendship already exists
        const existingFriendship = await Friends.findOne({
            $or: [
                { character: characterId, friend: friendId },
                { character: friendId, friend: characterId }
            ]
        });

        if (existingFriendship) {
            return res.status(400).json({
                message: "failed",
                data: 'Friendship already exists'
            });
        }

        // Create new friendship
        const newFriendship = await Friends.create({
            character: characterId,
            friend: friendId
        });

        res.status(200).json({
            message: "success"
        });

    } catch (error) {
        res.status(400).json({
            message: "bad-request",
            data: "There's a problem with the server! Please contact support for more details."
        });
    }
};

// Get all friends for a character
exports.getFriends = async (req, res) => {
    try {
        const { characterId } = req.params;

        if(!characterId){

        }
            const friends = await Friends.find({
            $or: [
                { character: characterId },
                { friend: characterId }
            ]
        }).populate('character friend', 'username level badge');

        // Format the response to only include the friend's data
        const formattedFriends = friends.map(friendship => {
            const friendData = friendship.character._id.toString() === characterId 
                ? friendship.friend 
                : friendship.character;
            
            return {
                friendId: friendData._id,
                username: friendData.username,
                level: friendData.level,
                badge: friendData.badge,
                status: friendship.status,
                friendSince: friendship.friendSince
            };
        });

        res.status(StatusCodes.OK).json({
            success: true,
            count: formattedFriends.length,
            friends: formattedFriends
        });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};


// accept friend request

exports.acceptrejectFriendRequest = async (req, res) => {

    const { characterId, friendId, status } = req.body;

    if(status !== 'pending'){
        return res.status(400).json({
            message: "failed",
            data: "Invalid status"
        });
    } 

    // Check if friendship exists
    const friendship = await Friends.findOne({
        $or: [
            { character: characterId, friend: friendId },
            { character: friendId, friend: characterId }
        ]
    });

    if (friendship) {
        return res.status(400).json({
            message: "failed",
            data: 'Player is already a friend'
        });
    }
    
    if(status === 'accepted'){
        await Friends.findOneAndUpdate(
            { character: friendId, friend: characterId },
            { status: 'accepted' }
        )
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while accepting friend request. Error: ${err}`)
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
        })
    } else if (status === 'rejected'){
        await Friends.findOneAndDelete(
            { character: friendId, friend: characterId }
        ).then(data => data)
        .catch(err => {
            console.log(`There's a problem encountered while rejecting friend request. Error: ${err}`)
            return res.status(400).json({ message: "bad-request", data: "There's a problem with the server. Please contact support for more details."})
        })
    } else {
        return res.status(400).json({
            message: "failed",
            data: "Invalid status"
        });
    }
    res.status(200).json({
        message: 'success'
    });

}


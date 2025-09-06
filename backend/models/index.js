// Optional index to load models and setup associations
const User = require('./User');
const Video = require('./Video');
const Progress = require('./Progress');
const Transaction = require('./Transaction');


User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });
Video.hasMany(Progress, { foreignKey: 'videoId' });
Progress.belongsTo(Video, { foreignKey: 'videoId' });
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Video, Progress, Transaction };

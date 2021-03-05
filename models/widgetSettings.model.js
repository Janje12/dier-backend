const mongoose = require('mongoose');
const {Schema} = mongoose;

const widgetSettingsSchema = new Schema({
    username: {type: String, required: true, unique: true},
    group: [{
        groupTitle: {type: String, required: true},
        groupType: {type: String, required: true},
        groupColor: {type: String, required: true},
        groupPosition: {type: Number, required: true},
        widgetList: [
            {
                widgetTitle: {type: String, required: true},
                widgetSize: {type: String, required: true},
                widgetPosition: {type: Number, required: true},
            }],
    }],
});

module.exports = mongoose.model('WidgetSettings', widgetSettingsSchema);

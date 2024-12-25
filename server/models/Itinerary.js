import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

const DestinationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String },
  arrival_date: { type: Date },
  departure_date: { type: Date },
  activities: [String]  
});

const ItinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  destinations: [DestinationSchema],
}, { timestamps: true });

ItinerarySchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' });

const Itinerary = mongoose.model('Itinerary', ItinerarySchema);
export default Itinerary;

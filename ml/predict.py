import sys
import joblib
import json
import os

script_dir = os.path.dirname(__file__)
model = joblib.load(os.path.join(script_dir, 'club_predictor_model.pkl'))

le_hobbies = joblib.load(os.path.join(script_dir, 'le_hobbies.pkl'))
le_topics = joblib.load(os.path.join(script_dir, 'le_topics.pkl'))
le_extracurriculars = joblib.load(os.path.join(script_dir, 'le_extracurriculars.pkl'))
le_club = joblib.load(os.path.join(script_dir, 'le_club.pkl'))
print("guys im running")

input_data = json.loads(sys.stdin.read())
print("Received input:", input_data)

# Encode the input data
input_data['hobbies'] = le_hobbies.transform([input_data['hobbies']])[0]
input_data['topics'] = le_topics.transform([input_data['topics']])[0]
input_data['extracurriculars'] = le_extracurriculars.transform([input_data['extracurriculars']])[0]
encoded_data = [input_data['hobbies'], input_data['topics'], input_data['extracurriculars']]

# Prediction
prediction = model.predict([encoded_data])
predicted_club = le_club.inverse_transform([prediction])[0]
print('it is working')
print("Predicted club:", predicted_club)
print(predicted_club)

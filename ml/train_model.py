import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

# Load the data
data = pd.read_csv('student1.csv')

# Drop unnecessary columns
data.drop(['participation', 'time'], axis=1, inplace=True)

# Encode categorical variables
le_hobbies = LabelEncoder()
le_topics = LabelEncoder()
le_extracurriculars = LabelEncoder()
le_club = LabelEncoder()

data['hobbies'] = le_hobbies.fit_transform(data['hobbies'])
data['topics'] = le_topics.fit_transform(data['topics'])
data['extracurriculars'] = le_extracurriculars.fit_transform(data['extracurriculars'])
data['club'] = le_club.fit_transform(data['club'])

# Split the data into features (X) and target variable (y)
X = data[['hobbies', 'topics', 'extracurriculars']]
y = data['club']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a decision tree classifier
dtc = DecisionTreeClassifier(random_state=42)

# Train the model
dtc.fit(X_train, y_train)

# Save the model and encoders
joblib.dump(dtc, 'club_predictor_model.pkl')
joblib.dump(le_hobbies, 'le_hobbies.pkl')
joblib.dump(le_topics, 'le_topics.pkl')
joblib.dump(le_extracurriculars, 'le_extracurriculars.pkl')
joblib.dump(le_club, 'le_club.pkl')

print("Model and encoders saved successfully.")

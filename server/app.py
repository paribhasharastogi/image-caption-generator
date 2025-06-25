from flask import Flask, request, jsonify
import cv2
import numpy as np
from keras.applications.inception_v3 import InceptionV3, preprocess_input
from keras.models import Model
from keras.layers import Dense, Input, LSTM, Embedding, RepeatVector, TimeDistributed, Concatenate, Activation
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask_cors import CORS

# Load InceptionV3 model (without the top layer)
print("="*50)
print("InceptionV3 model loaded")
inception = InceptionV3(include_top=False, weights='imagenet', input_shape=(299, 299, 3), pooling='avg')

# Load vocabulary and reverse vocabulary
vocab = np.load('vocab.npy', allow_pickle=True).item()
inv_vocab = {v: k for k, v in vocab.items()}

embedding_size = 128
max_len = 40
vocab_size = len(vocab)

# Define the image captioning model architecture
image_input = Input(shape=(2048,))
image_features = Dense(embedding_size, activation='relu')(image_input)
image_features = RepeatVector(max_len)(image_features)

language_input = Input(shape=(max_len,))
language_features = Embedding(input_dim=vocab_size, output_dim=embedding_size)(language_input)
language_features = LSTM(256, return_sequences=True)(language_features)
language_features = TimeDistributed(Dense(embedding_size))(language_features)

merged = Concatenate()([image_features, language_features])
x = LSTM(128, return_sequences=True)(merged)
x = LSTM(512, return_sequences=False)(x)
x = Dense(vocab_size)(x)
output = Activation('softmax')(x)

model = Model(inputs=[image_input, language_input], outputs=output)
model.compile(loss='categorical_crossentropy', optimizer='RMSprop', metrics=['accuracy'])
model.load_weights('mine_model_weights.h5')

print("="*50)
print("Image captioning model loaded")

# Set up Flask app
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/after', methods=['POST'])
def after():
    file = request.files['file']
    file.save('static/file.jpg')
    
    # Read and preprocess image for InceptionV3
    img = cv2.imread('static/file.jpg')
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (299, 299))
    img = np.reshape(img, (1, 299, 299, 3))
    img = preprocess_input(img)

    # Extract features
    features = inception.predict(img).reshape(1, 2048)
    print("="*50)
    print("Extracted image features")

    # Generate caption
    text_in = ['startofseq']
    final = ''
    print("="*50)
    print("Generating caption...")

    count = 0
    while count < 20:
        count += 1
        encoded = [vocab.get(word, 0) for word in text_in]

        # Pad sequence manually
        padded = pad_sequences([encoded], maxlen=max_len, padding='post')

        preds = model.predict([features, padded], verbose=0)[0]
        sampled_index = np.argmax(preds)
        sampled_word = inv_vocab.get(sampled_index, '')

        if sampled_word == 'endofseq' or sampled_word == '':
            break

        final += ' ' + sampled_word
        text_in.append(sampled_word)

        # Optional: prevent infinite loops from repetition
        if len(text_in) >= 4 and len(set(text_in[-3:])) == 1:
            print("Breaking due to repetition.")
            break

    return jsonify({'caption': final.strip()})

if __name__ == "__main__":
    app.run(debug=True)

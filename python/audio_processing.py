import subprocess
import random
import sys
sys.path.append("../python")
import numpy as np
import os
from sklearn.decomposition import PCA
from sklearn.manifold import Isomap
from sklearn.manifold import TSNE
#import umap
from sklearn.cluster import KMeans
#from sklearn.cluster import DBSCAN
#from autoencoder import AE
import pandas as pd

# make this so you can enter the filename
DIR = "C:\\Users\\ptut0\\Documents\\shouts\\hearing_beliving\\web\\static\\\data\\"

color_dict = {
    "-1": "black",
    "0": "blue",
    "1": "green",
    "2": "yellow",
    "3": "red",
    "4": "purple",
    "5": "orange",
    "6": "teal",
    "7": "brown",
    "8": "black",
    "9": "blue",
    "10": "green",
    "11": "yellow",
    "12": "red",
    "13": "purple",
    "14": "orange",
    "15": "teal",
    "16": "brown",
    "17": "black",
    "18": "blue",
    "19": "green",
}
    
def main(session_key, feature_filename):
  #got rid of getting audio files but may need them to play them?  
  feature_data = pd.read_csv(os.path.join(DIR, feature_filename))

  features = feature_data.drop(['filename', 'duration', 'phone_position', 'script', 'loudness', 'distress', 'affect', 'predicted_loudness', 'predicted_distress'],  axis=1)

  output_dir = os.path.join(DIR, session_key)
  subprocess.call(["mkdir", output_dir])

  # Run data through t-SNE
  tsne = TSNE(n_components=2, perplexity=25)#, random_state=None)
  Y1 = convert_range(tsne.fit_transform(features))
  print("t-SNE done")

  Y1x, Y1y = zip(*Y1)

  # Run data through PCA
  pca = PCA(n_components=2)
  Y2 = convert_range(pca.fit_transform(features))
  print("PCA done")

  Y2x, Y2y = zip(*Y2)

  # Run data through UMAP
  #run_umap = True
  #if run_umap:
  #    Y4 = convert_range(umap.UMAP().fit_transform(features))
  #    print("UMAP done")
  #else:
  #    Y4 = convert_range(np.array([np.array([random.randint(-50, 50), random.randint(-50, 50)]) for i in range(len(Y2))]))
#
  #Y4x, Y4y = zip(*Y4)
  Y4 = Y2
  Y4x, Y4y = zip(*Y4)

  # Run data through isomap
  IM = Isomap(n_components=2)
  Y5 = convert_range(IM.fit_transform(features))
  print("Isomap done")

  Y5x, Y5y = zip(*Y5)

  # Experiment with autoencoder, bad results so commented for now
  # Run data through autoencoder
  # ae = False
  # if ae:
  #     Y5 = convert_range(AE(result))
  # else:
  #     Y5 = convert_range(np.array([np.array([random.randint(-50, 50), random.randint(-50, 50)]) for i in range(len(Y2))]))
  # print("Autoencoder done")



  # K-means on raw features
  kmeans2 = KMeans(n_clusters=2, random_state=0).fit(features)
  print("kmeans2 done")
  kmeans3 = KMeans(n_clusters=3, random_state=0).fit(features)
  print("kmeans3 done")
  kmeans4 = KMeans(n_clusters=4, random_state=0).fit(features)
  print("kmeans4 done")
  kmeans5 = KMeans(n_clusters=5, random_state=0).fit(features)
  print("kmeans5 done")
  kmeans6 = KMeans(n_clusters=6, random_state=0).fit(features)
  print("kmeans6 done")
  kmeans7 = KMeans(n_clusters=7, random_state=0).fit(features)
  print("kmeans7 done")
  kmeans8 = KMeans(n_clusters=8, random_state=0).fit(features)
  print("kmeans8 done")
  kmeans20 = KMeans(n_clusters=20, random_state=0).fit(features)
  print("kmeans20 done")

  print(kmeans20)
  # Format t-SNE output to correct dictionary format

  data = pd.DataFrame({
          "filename":feature_data['filename'],
          "tsneX":Y1x, 
          "tsneY":Y1y, 
          "pcaX":Y2x, 
          "pcaY":Y2y,
          "umapX":Y4x, 
          "umapY":Y4y, 
          "isoX":Y5x, 
          "isoY":Y5y,  
          "active":1, 
          "color":"black",
          "kcolor2":[color_dict[str(key)] for key in kmeans2.labels_],
          "kcolor3":[color_dict[str(key)] for key in kmeans3.labels_],
          "kcolor4":[color_dict[str(key)] for key in kmeans4.labels_], 
          "kcolor5":[color_dict[str(key)] for key in kmeans5.labels_], 
          "kcolor6":[color_dict[str(key)] for key in kmeans6.labels_], 
          "kcolor7":[color_dict[str(key)] for key in kmeans7.labels_], 
          "kcolor8":[color_dict[str(key)] for key in kmeans8.labels_],
          "kcolor20":[color_dict[str(key)] for key in kmeans20.labels_],
          "duration":feature_data['duration'],
          "phone_position":feature_data['phone_position'],
          "script":feature_data['script'],
          "loudness":feature_data['loudness'],
          "distress":feature_data['distress'],
          "affect":feature_data['affect'],
          "predicted_loudness":feature_data['predicted_loudness'],
          "predicted_distress":feature_data['predicted_distress'],
          "zero_crossing":feature_data['analyse_zero_crossing'],
          "harmonics":feature_data['analyse_harmonics'],
          "pauses":feature_data['pauses'],
          "max_intensity":feature_data['get_max_intensity'],
          "intensity":feature_data['analyse_intensity'],
          "pitch":feature_data['analyse_pitch'],
          "pitch_range":feature_data['analyse_pitch_range'],
          "shimmer":feature_data['analyse_shimmer'],
          "jitter":feature_data['analyse_jitter'],
          "spectral_slope":feature_data['spectral_slope'],
          "mean_mfcc":feature_data['analyse_mfcc'],
          "spectral_rolloff":feature_data['mean_spectral_rolloff'],
          "energy":feature_data['get_energy'],
          "speechrate":feature_data['speechrate(nsyll / dur)']
          })

  # Save data as csv to be able to load later
  data.to_csv(os.path.join(output_dir, "data.csv"))


def convert_range(Y):
    new_range = (80 - (-80))  
    Y_x = Y[:,0]

    old_range_x = (max(Y_x) - min(Y_x))  
    new_Y_x = (((Y_x - min(Y_x)) * new_range) / old_range_x) + (-80)

    Y_y = Y[:,1]
    old_range_y = (max(Y_y) - min(Y_y))  
    new_Y_y = (((Y_y - min(Y_y)) * new_range) / old_range_y) + (-80)
    
    return np.array((new_Y_x, new_Y_y)).T
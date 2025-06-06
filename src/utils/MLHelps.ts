// src/utils/MLHelpers.ts
import * as tf from '@tensorflow/tfjs';

export function getKMeansLabels(data: any[], k = 3) {
  // Transform into numeric feature vectors
  const inputData = data.map((item) => [
    item.riskScore || 0,
    item.emailCount || 0,
    item.usbCount || 0,
    item.cloudCount || 0,
  ]);

  const xs = tf.tensor2d(inputData);

  // Basic KMeans implementation using @tensorflow/tfjs
  const centroids = tf.tidy(() => {
    const indices = tf.util.createShuffledIndices(xs.shape[0]);
    const shuffled = tf.gather(xs, tf.tensor1d(Array.from(indices), "int32"));

    return shuffled.slice([0, 0], [k, -1]);
  });

  const assignClusters = () => {
    return tf.tidy(() => {
      const expandedPoints = xs.expandDims(1); // shape [n, 1, d]
      const expandedCentroids = centroids.expandDims(0); // shape [1, k, d]
      const distances = tf.sub(expandedPoints, expandedCentroids)
        .square()
        .sum(-1);
      return distances.argMin(1).arraySync(); // [n]
    });
  };

  const labels = assignClusters();
  tf.dispose([xs, centroids]);

  return labels as number[];
}

/**
 * @swagger
 * /predict:
 *   post:
 *     summary: Predict Titanic survival
 *     description: Takes passenger details and returns survival prediction, probability, and model accuracy.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Pclass
 *               - Sex
 *               - Age
 *               - SibSp
 *               - Parch
 *               - Fare
 *               - Embarked
 *             properties:
 *               Pclass:
 *                 type: string
 *                 example: "2"
 *               Sex:
 *                 type: string
 *                 enum: ["male", "female"]
 *                 example: "male"
 *               Age:
 *                 type: number
 *                 example: 42
 *               SibSp:
 *                 type: integer
 *                 example: 1
 *               Parch:
 *                 type: integer
 *                 example: 1
 *               Fare:
 *                 type: number
 *                 example: 400
 *               Embarked:
 *                 type: string
 *                 enum: ["C", "Q", "S"]
 *                 example: "S"
 *     responses:
 *       200:
 *         description: Successful prediction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: object
 *                   properties:
 *                     prediction:
 *                       type: integer
 *                       example: 1
 *                     survival_probability:
 *                       type: number
 *                       example: 0.9658
 *                     accuracy:
 *                       type: number
 *                       example: 0.785
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 */

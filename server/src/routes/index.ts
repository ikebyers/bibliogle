import express from 'express';
import apiRoutes from './api/index.js';

const router = express.Router();

router.use('/api', apiRoutes);

export default router;

// import type { Request, Response } from 'express';
// import express from 'express';
// const router = express.Router();

// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import apiRoutes from './api/index.js';

// router.use('/api', apiRoutes);

// // serve up react front-end in production
// router.use((_req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, '.'));
// });

// export default router;

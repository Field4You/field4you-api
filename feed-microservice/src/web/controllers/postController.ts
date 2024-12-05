import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Para gerar nomes únicos
import { Post } from '../../domain/entities/Post';
import { createPost } from '../../application/use-cases/createPost';
import { getLast10 } from '../../application/use-cases/getLast10';
import { deletePost } from '../../application/use-cases/deletePost';
import { bucket, jwtHelper, postRepository } from '../../app';

export const createPostController = async (req: Request, res: Response) => {
  // Extract token from Authorization Header
  const token = await jwtHelper.extractBearerToken(req);
  if (!token) {
    res.status(401).json({ message: 'Bearer token required' });
    return;
  }

  const decodedPayload = await jwtHelper.decodeBearerToken(token);
  if (!decodedPayload) {
    res.status(500).json({ message: 'Error while validating authentication' });
    return;
  }

  const { userId, userType, email, iat, exp } = decodedPayload;

  if (!req.file) {
    res.status(400).json({
      message: 'Please upload an Image',
    });
    return;
  }

  try {
    const { originalname, buffer } = req.file;
    const fileName = `${uuidv4()}-${originalname}`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
      public: true,
    });

    // Image URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    const postRequest = new Post({
      creatorId: userId,
      creatorEmail: email,
      comments: req.body.comments,
      imageName: req.file?.originalname,
      imageURL: publicUrl,
    });

    const newPost = await createPost(postRequest, postRepository);
    if (!newPost) {
      res.status(500).json({
        message: 'Something went wrong for new post creation',
      });
      return;
    }

    res.status(200).json({
      message: 'Successfully created the post.',
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something went wrong',
    });
    return;
  }
};

export const getLast10PostController = async (req: Request, res: Response) => {
  try {
    const last10Posts = await getLast10(postRepository);
    res.status(200).json(last10Posts);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something went wrong',
    });
    return;
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  const token = await jwtHelper.extractBearerToken(req);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid ID format' });
    return;
  }

  if (!token) {
    res.status(401).json({ message: 'Bearer token required' });
    return;
  }

  try {
    const { status, message } = await deletePost(id, token, postRepository);
    res.status(status).json({ message: message });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something went wrong',
    });
    return;
  }
};
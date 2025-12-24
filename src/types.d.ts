import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string, role: string }; // define your user payload here
    }
  }
}
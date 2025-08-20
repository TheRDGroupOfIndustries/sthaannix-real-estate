import { Request, Response } from "express";
import mongoose from "mongoose";
import Property from "../models/Property";
import { uploadFile } from "../utils/uploadToCloudinary";

declare global {
  namespace Express {
    interface UserPayload {
      [x: string]: any;
      id: string;
      role: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

const canCreateProperty = (role?: string) =>
  ["broker", "builder", "owner"].includes(role || "");

const isOwnerOrAdmin = (
  userId: string,
  ownerId: mongoose.Types.ObjectId,
  role?: string
) => role === "admin" || userId === ownerId.toString();


// export const createProperty = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     if (!canCreateProperty(req.user.role)) {
//       return res.status(403).json({ message: "You cannot create properties" });
//     }

//     const {
//       title,
//       description,
//       propertyType,
//       transactionType,
//       price,
//       size,
//       bhk,
//       location,
//       isPromoted,
//     } = req.body;

//     const uploadedImages: string[] = [];
//     if (req.files && Array.isArray(req.files)) {
//       for (const file of req.files as Express.Multer.File[]) {
//         const result = await uploadFile(file.buffer, "properties/images");
//         uploadedImages.push(result.secure_url);
//       }
//     }

//     const property = new Property({
//       title,
//       description,
//       propertyType,
//       transactionType,
//       price,
//       size,
//       bhk,
//       location,
//       isPromoted,
//       owner: req.user.id,
//       images: uploadedImages,
//       videos: [],
//     });

//     await property.save();
//     res.status(201).json(property);
//   } catch (error) {
//     console.error("Create Property Error:", error);
//     res.status(500).json({ message: "Failed to create property", error });
//   }
// };


export const getProperties = async (req: Request, res: Response) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      city,
      sort,
      status, 
    } = req.query as {
      search?: string;
      minPrice?: string;
      maxPrice?: string;
      city?: string;
      sort?: string;
      status?: string;
    };

    const filter: Record<string, any> = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (city) {
      filter["location.city"] = new RegExp(city, "i");
    }

    if (status) {
      const allowedStatuses = ["pending", "approved", "rejected"];
      if (allowedStatuses.includes(status)) {
        filter.status = status;
      } else {
        return res.status(400).json({ message: `Invalid status: ${status}` });
      }
    }

    const sortOptions: Record<string, any> = {};
    if (sort === "newest") sortOptions.createdAt = -1;
    if (sort === "cheapest") sortOptions.price = 1;

    const properties = await Property.find(filter).sort(sortOptions).exec();
    res.json(properties);
  } catch (error) {
    console.error("Get Properties Error:", error);
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
};


export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Get Property By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch property", error });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (!isOwnerOrAdmin(req.user.id, property.owner, req.user.role)) {
      return res.status(403).json({ message: "You cannot update this property" });
    }

    const {
      title,
      description,
      price,
      size,
      bhk,
      location,
      isPromoted,
    } = req.body;

    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (price !== undefined) property.price = price;
    if (size !== undefined) property.size = size;
    if (bhk !== undefined) property.bhk = bhk;
    if (location !== undefined) property.location = location;
    if (isPromoted !== undefined) property.isPromoted = isPromoted;

    await property.save();
    res.json(property);
  } catch (error) {
    console.error("Update Property Error:", error);
    res.status(500).json({ message: "Failed to update property", error });
  }
};


export const deleteProperty = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (!isOwnerOrAdmin(req.user.id, property.owner, req.user.role)) {
      return res.status(403).json({ message: "You cannot delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete Property Error:", error);
    res.status(500).json({ message: "Failed to delete property", error });
  }
};

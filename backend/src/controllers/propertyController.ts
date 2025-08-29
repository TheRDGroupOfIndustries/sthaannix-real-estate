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
  ["broker", "builder", "owner", "admin"].includes(role || "");

const isOwnerOrAdmin = (
  userId: string,
  ownerId: mongoose.Types.ObjectId,
  role?: string
) => role === "admin" || userId === ownerId.toString();

export const createProperty = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!canCreateProperty(req.user.role))
      return res.status(403).json({ message: "You cannot create properties" });

    const {
      title,
      description,
      propertyType,
      transactionType,
      price,
      size,
      bhk,
      bathroom,
      location,
      isPromoted,
    } = req.body;

    console.log(
      "Data: ",
      title,
      description,
      propertyType,
      transactionType,
      price,
      size,
      bhk,
      bathroom,
      location,
      isPromoted
    );

    if (isNaN(price)) {
      return res.status(400).json({ message: "Price must be a valid number" });
    }
    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    const uploadedImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await uploadFile(file.buffer, "properties/images");
        uploadedImages.push(result.secure_url);
      }
    }

    const property = new Property({
      title,
      description,
      propertyType,
      transactionType,
      price: Number(price),
      size: size ? Number(size) : undefined,
      bhk: bhk ? Number(bhk) : undefined,
      bathroom: bhk ? Number(bathroom) : undefined,
      location: parsedLocation,
      isPromoted: isPromoted === "true" || isPromoted === true,
      owner: req.user.id,
      images: uploadedImages,
      videos: [],
      status: req.user.role === "admin" ? "approved" : "pending", 
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error("Create Property Error:", error);
    res.status(500).json({ message: "Failed to create property", error });
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { search, minPrice, maxPrice, city, sort, status } = req.query as {
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
      return res
        .status(403)
        .json({ message: "You cannot update this property" });
    }

    // Extract fields from req.body
    const {
      title,
      description,
      price,
      size,
      bhk,
      bathroom,
      location,
      isPromoted,
      propertyType,
      transactionType,
      existingImages, // <-- frontend will send this
    } = req.body;

    // Handle new uploaded images
    const uploadedImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await uploadFile(file.buffer, "properties/images");
        uploadedImages.push(result.secure_url);
      }
    }

    // Merge existing + new images
    let finalImages: string[] = [];
    if (existingImages) {
      if (Array.isArray(existingImages)) {
        finalImages = existingImages;
      } else {
        finalImages = [existingImages]; // single string case
      }
    }
    finalImages = [...finalImages, ...uploadedImages];

    // Update fields if provided
    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (price !== undefined) property.price = Number(price);
    if (size !== undefined) property.size = Number(size);
    if (bhk !== undefined) property.bhk = Number(bhk);
    if (bathroom !== undefined) property.bathroom = Number(bathroom);
    if (propertyType !== undefined) property.propertyType = propertyType;
    if (transactionType !== undefined)
      property.transactionType = transactionType;

    if (location !== undefined) {
      property.location =
        typeof location === "string" ? JSON.parse(location) : location;
    }

    if (isPromoted !== undefined) {
      property.isPromoted = isPromoted === "true" || isPromoted === true;
    }

    // Update images (only if provided, else keep old ones)
    if (finalImages.length > 0) {
      property.images = finalImages;
    }

    await property.save();

    res.json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Update Property Error:", error);
    res.status(500).json({ message: "Failed to update property", error });
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
      return res
        .status(403)
        .json({ message: "You cannot delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete Property Error:", error);
    res.status(500).json({ message: "Failed to delete property", error });
  }
};

// export const myProperties = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const { sort, status } = req.query as {
//       sort?: string;
//       status?: string;
//     };

//     const filter: Record<string, any> = { owner: req.user.id };

//     if (status) {
//       const allowedStatuses = ["pending", "approved", "rejected"];
//       if (allowedStatuses.includes(status)) {
//         filter.status = status;
//       } else {
//         return res.status(400).json({ message: `Invalid status: ${status}` });
//       }
//     }

//     const sortOptions: Record<string, any> = {};
//     if (sort === "newest") sortOptions.createdAt = -1;
//     if (sort === "cheapest") sortOptions.price = 1;

//     const properties = await Property.find(filter).sort(sortOptions).exec();

//     res.json(properties);
//   } catch (error) {
//     console.error("My Properties Error:", error);
//     res.status(500).json({ message: "Failed to fetch your properties", error });
//   }
// };

export const myProperties = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { sort } = req.query as { sort?: string };

    const filter: Record<string, any> = {
      owner: req.user.id,
      status: "approved",  //  Only approved properties
    };

    const sortOptions: Record<string, any> = {};
    if (sort === "newest") sortOptions.createdAt = -1;
    if (sort === "cheapest") sortOptions.price = 1;

    const properties = await Property.find(filter).sort(sortOptions).exec();

    res.json(properties);
  } catch (error) {
    console.error("My Properties Error:", error);
    res.status(500).json({ message: "Failed to fetch your properties", error });
  }
};





// export const createProperty = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     if (!canCreateProperty(req.user.role)) {
//       return res.status(403).json({ message: "You cannot create properties" });
//     }
//     // if (req.user.status === "pending") {
//     //   return res.status(403).json({
//     //     message:
//     //       "Your account is pending approval. You cannot create properties yet.",
//     //   });
//     // }
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

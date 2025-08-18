import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";
import prisma from "../client/connect.js";

// CREATE Property
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      type,
      price,
      location,
      description,
      beds,
      baths,
      sqft,
      phone,
      availability,
      amenities,
      ownerId,
    } = req.body;

    const files = req.files || [];
    const uploadedImages = [];

    for (const file of files) {
      const url = await uploadBufferToCloudinary(file.buffer, file.originalname, "properties");
      uploadedImages.push(url);
    }

        const property = await prisma.property.create({
        data: {
            title,
            type,
            price: Number(price),
            location,
            description,
            beds: beds ? Number(beds) : null,
            baths: baths ? Number(baths) : null,
            sqft: sqft ? Number(sqft) : null,
            phone,
            availability,
            amenities: Array.isArray(amenities) ? amenities : (amenities ? JSON.parse(amenities) : []),
            ownerId,
            images: {
            create: uploadedImages.map((url) => ({ url })),
            },
        },
        include: { images: true },
        });


    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create property", error });
  }
};

// GET all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: { images: true, owner: true },
    });
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
};

// GET property by ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: { images: true, owner: true },
    });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch property", error });
  }
};

// UPDATE property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      price,
      location,
      description,
      beds,
      baths,
      sqft,
      phone,
      availability,
      amenities,
    } = req.body;

    const files = req.files || [];
    let uploadedImages = [];

    if (files.length > 0) {
      for (const file of files) {
        const url = await uploadBufferToCloudinary(file.buffer, file.originalname, "properties");
        uploadedImages.push(url);
      }
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title,
        type,
        price: price ? Number(price) : undefined,
        location,
        description,
        beds: beds ? Number(beds) : undefined,
        baths: baths ? Number(baths) : undefined,
        sqft: sqft ? Number(sqft) : undefined,
        phone,
        availability,
        amenities: Array.isArray(amenities) ? amenities : (amenities ? JSON.parse(amenities) : []),
        images: uploadedImages.length
          ? {
              deleteMany: {},
              create: uploadedImages.map((url) => ({ url })),
            }
          : undefined,
      },
      include: { images: true },
    });

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update property", error });
  }
};

// DELETE property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.property.delete({ where: { id } });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete property", error });
  }
};



import { useState } from "react";

function VenueForm({
  initialValues = {},
  onSubmit,
  isLoading = false,
  submitLabel = "Create venue",
}) {
  const [formData, setFormData] = useState({
    name: initialValues.name ?? "",
    description: initialValues.description ?? "",
    price: initialValues.price ?? "",
    maxGuests: initialValues.maxGuests ?? 1,
    imageUrl: initialValues.media?.[0]?.url ?? "",
    imageAlt: initialValues.media?.[0]?.alt ?? "",
    city: initialValues.location?.city ?? "",
    country: initialValues.location?.country ?? "",
    wifi: initialValues.meta?.wifi ?? false,
    parking: initialValues.meta?.parking ?? false,
    breakfast: initialValues.meta?.breakfast ?? false,
    pets: initialValues.meta?.pets ?? false,
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const price = Number(formData.price);
    const maxGuests = Number(formData.maxGuests);

    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Please enter a name and description.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!Number.isInteger(maxGuests) || maxGuests < 1) {
      setError("Please enter a valid number of guests.");
      return;
    }

const imageUrl = formData.imageUrl.trim();

    if (imageUrl) {
      try {
        const url = new URL(imageUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        setError("Please enter a valid image URL.");
        return;
      }
    }

    const venueData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price,
      maxGuests,
      media: imageUrl
        ? [
            {
              url: imageUrl,
              alt: formData.imageAlt.trim(),
            },
          ]
        : [],
      location: {
        city: formData.city.trim() || null,
        country: formData.country.trim() || null,
      },
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
    };

    await onSubmit(venueData);
  }

  return (
    <form className="venue-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Venue name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>


      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          required
        />
      </div>

      <div>
        <label htmlFor="price">Price per night (NOK)</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="maxGuests">Maximum guests</label>
        <input
          id="maxGuests"
          name="maxGuests"
          type="number"
          min="1"
          step="1"
          value={formData.maxGuests}
          onChange={handleChange}
          required
        />
    </div>

      <div>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>


      <div>
        <label htmlFor="imageAlt">Image description</label>
        <input
          id="imageAlt"
          name="imageAlt"
          maxLength={119}
          value={formData.imageAlt}
          onChange={handleChange}
        />
      </div>

     <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

         <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </div>

      <fieldset>
        <legend>Amenities</legend>

        {["wifi", "parking", "breakfast", "pets"].map(
          (amenity) => (
            <label className="amenity-option" key={amenity}>
              <input
                type="checkbox"
                name={amenity}
                checked={formData[amenity]}
                onChange={handleChange}
              />
              {amenity.charAt(0).toUpperCase() +
                amenity.slice(1)}
            </label>
          ))}
      </fieldset>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </form>
  );}

export default VenueForm;

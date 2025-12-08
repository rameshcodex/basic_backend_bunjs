# Update Profile API Documentation

## Endpoint
**PUT** `/users/update-profile`

## Authentication
Requires Bearer token in Authorization header:
```
Authorization: Bearer <your_paseto_token>
```

## Request Type
`multipart/form-data`

## Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | User's new name |
| `profile_picture` | file | No | Profile picture image file (JPEG, PNG, GIF, WebP) |

**Note:** At least one field must be provided.

## File Constraints
- **Max file size:** 5MB
- **Allowed formats:** JPEG, JPG, PNG, GIF, WebP
- **File naming:** Auto-generated unique filename with format: `{userId}_{randomHash}.{extension}`

## Example Requests

### Using cURL (Update Name Only)
```bash
curl -X PUT http://localhost:3000/users/update-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=John Doe"
```

### Using cURL (Update Profile Picture Only)
```bash
curl -X PUT http://localhost:3000/users/update-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "profile_picture=@/path/to/image.jpg"
```

### Using cURL (Update Both)
```bash
curl -X PUT http://localhost:3000/users/update-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=John Doe" \
  -F "profile_picture=@/path/to/image.jpg"
```

### Using JavaScript (Fetch API)
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('profile_picture', fileInput.files[0]);

fetch('http://localhost:3000/users/update-profile', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Using Postman
1. Set method to **PUT**
2. URL: `http://localhost:3000/users/update-profile`
3. Go to **Headers** tab:
   - Add: `Authorization: Bearer YOUR_TOKEN_HERE`
4. Go to **Body** tab:
   - Select **form-data**
   - Add key `name` with value (Text)
   - Add key `profile_picture` with file (File)

## Response Examples

### Success Response (200)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "result": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "profile_picture": "/public/uploads/profile-pictures/507f1f77bcf86cd799439011_a1b2c3d4e5f6g7h8.jpg",
    "unique_id": "MTS-12345678"
  }
}
```

### Error Responses

#### 400 - No Data Provided
```json
{
  "success": false,
  "message": "No data provided"
}
```

#### 400 - Invalid File Type
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
}
```

#### 400 - No Valid Fields
```json
{
  "success": false,
  "message": "No valid fields to update"
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### 413 - File Too Large
```json
{
  "success": false,
  "message": "File size exceeds the limit"
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Image Access

Uploaded profile pictures can be accessed via:
```
http://localhost:3000/public/uploads/profile-pictures/{filename}
```

Example:
```
http://localhost:3000/public/uploads/profile-pictures/507f1f77bcf86cd799439011_a1b2c3d4e5f6g7h8.jpg
```

## Features

✅ **File Upload:** Supports multipart/form-data for file uploads  
✅ **Image Validation:** Only allows image files (JPEG, PNG, GIF, WebP)  
✅ **File Size Limit:** Maximum 5MB per file  
✅ **Unique Filenames:** Auto-generates unique filenames to prevent conflicts  
✅ **Old File Cleanup:** Automatically deletes old profile picture when uploading new one  
✅ **Flexible Updates:** Can update name, profile picture, or both  
✅ **Authentication:** Protected by token validation middleware  
✅ **Static File Serving:** Images are accessible via public URL  

## Storage Location

Profile pictures are stored in:
```
/public/uploads/profile-pictures/
```

## Notes

- The old profile picture is automatically deleted when a new one is uploaded
- If the upload fails, the old profile picture remains unchanged
- The profile picture URL is stored in the database as a relative path
- Images are served statically through the `/public/` prefix


/* ========================================
   CLOUDINARY IMAGE OPTIMIZATION
======================================== */

export const optimizeCloudinaryImage = (
    url,
    width = 900
) => {
    if (!url) return "";

    if (!url.includes("res.cloudinary.com")) {
        return url;
    }

    const safeWidth = Math.max(
        1,
        Math.round(Number(width) || 900)
    );

    return url.replace(
        "/image/upload/",
        `/image/upload/f_auto,q_auto,c_limit,w_${safeWidth}/`
    );
};

// ensure updated_date
db.questions.updateMany(
    {$or:[{"updated_date":{"$eq":null}}, {"updated_date":{"$eq":''}}]},
    [
        {"$set": {"updated_date": 0}
    ]
)


// media
media
media_ogg 
media_webm
media_mp4
autoplay_media
mediaattribution

image
imageattribution
autoshow_image

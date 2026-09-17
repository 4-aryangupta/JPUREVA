from datetime import datetime

import piexif


def _rational_to_deg(rationals) -> float:
    degrees, minutes, seconds = rationals
    d = degrees[0] / degrees[1]
    m = minutes[0] / minutes[1]
    s = seconds[0] / seconds[1]
    return d + (m / 60.0) + (s / 3600.0)


def extract_geo_and_timestamp(file_obj):
    """Best-effort EXIF GPS + timestamp extraction. Returns (lat, lng, captured_at, locked).

    `locked=False` whenever GPS/timestamp EXIF tags are missing, flagging the photo for
    manual review rather than trusting a client-supplied coordinate.
    """
    try:
        file_obj.seek(0)
        exif_dict = piexif.load(file_obj.read())
        file_obj.seek(0)
    except Exception:
        return None, None, None, False

    lat = lng = captured_at = None

    gps = exif_dict.get("GPS", {})
    try:
        lat_ref = gps[piexif.GPSIFD.GPSLatitudeRef].decode()
        lat_val = _rational_to_deg(gps[piexif.GPSIFD.GPSLatitude])
        lat = -lat_val if lat_ref == "S" else lat_val

        lng_ref = gps[piexif.GPSIFD.GPSLongitudeRef].decode()
        lng_val = _rational_to_deg(gps[piexif.GPSIFD.GPSLongitude])
        lng = -lng_val if lng_ref == "W" else lng_val
    except (KeyError, ZeroDivisionError, IndexError):
        lat = lng = None

    exif_ifd = exif_dict.get("Exif", {})
    try:
        raw_dt = exif_ifd[piexif.ExifIFD.DateTimeOriginal].decode()
        captured_at = datetime.strptime(raw_dt, "%Y:%m:%d %H:%M:%S")
    except (KeyError, ValueError):
        captured_at = None

    locked = lat is not None and lng is not None and captured_at is not None
    return lat, lng, captured_at, locked

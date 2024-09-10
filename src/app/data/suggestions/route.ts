import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

import { Innertube, YTNodes } from "youtubei.js";
import YTMusic from "ytmusic-api";
import { ArtistMetadata } from "@/util/types/ArtistData";

export async function GET(req: NextRequest) {
  let songId: string | null = req.nextUrl.searchParams.get("id");
  //const artist: string | null = req.nextUrl.searchParams.get("artist");

  if (
    !songId ||
    songId.trim().length === 0
    // !artist ||
    // artist.trim().length === 0
  ) {
    console.log(" INFO /data/suggestions 'Invalid params'");
    return NextResponse.json({ message: "Invalid params" }, { status: 403 });
  }

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /data/suggestions 'Failed to initialize ytmusic'");
    return NextResponse.json(
      { message: "Failed to initialize ytmusic" },
      { status: 500 }
    );
  }

  const yt = await Innertube.create();

  const res = await yt.music.getRelated(songId);
  const suggestions = await Promise.all(
    res
      .as(YTNodes.SectionList)
      .contents[0].as(YTNodes.MusicCarouselShelf)
      .contents.map((item) => item.as(YTNodes.MusicResponsiveListItem))
      .map(async (item, i) => {
        return {
          id: item.id!,
          url: `https://www.youtube.com/watch?v=${item.id!}`,
          title: item.flex_columns[0].title.text?.toString() || "Unknown",
          thumbnail: item.thumbnails[0].url,
          duration:
            item.duration?.seconds ||
            (await ytMusic.getSong(item.id!)).duration ||
            0,
          artist: {
            name: item.flex_columns[1].title.text?.toString() || "Unknown",
            id:
              item.flex_columns[1].title.endpoint?.payload?.browseId ||
              "Unknown",
          },
          album: {
            name: item.flex_columns[2].title.text?.toString() || "Unknown",
            id:
              item.flex_columns[2].title.endpoint?.payload?.browseId ||
              "Unknown",
          },
          moreThumbnails: item.thumbnails
            .sort((a, b) => b.width - a.width)
            .map((t) => t.url),
        };
      })
  );

  return NextResponse.json(suggestions, {
    status: 200,
  });
}

/**
 * [
        {
            "type": "MusicResponsiveListItemFlexColumn",
            "title": {
                "runs": [
                    {
                        "text": "Habibi",
                        "bold": false,
                        "italics": false,
                        "strikethrough": false,
                        "endpoint": {
                            "type": "NavigationEndpoint",
                            "payload": {
                                "videoId": "QNNYvh9_Y1g",
                                "watchEndpointMusicSupportedConfigs": {
                                    "watchEndpointMusicConfig": {
                                        "musicVideoType": "MUSIC_VIDEO_TYPE_ATV"
                                    }
                                }
                            },
                            "metadata": {
                                "api_url": "/player"
                            }
                        }
                    }
                ],
                "text": "Habibi",
                "endpoint": {
                    "type": "NavigationEndpoint",
                    "payload": {
                        "videoId": "QNNYvh9_Y1g",
                        "watchEndpointMusicSupportedConfigs": {
                            "watchEndpointMusicConfig": {
                                "musicVideoType": "MUSIC_VIDEO_TYPE_ATV"
                            }
                        }
                    },
                    "metadata": {
                        "api_url": "/player"
                    }
                }
            },
            "display_priority": "MUSIC_RESPONSIVE_LIST_ITEM_COLUMN_DISPLAY_PRIORITY_HIGH"
        },
        {
            "type": "MusicResponsiveListItemFlexColumn",
            "title": {
                "runs": [
                    {
                        "text": "Asim Azhar",
                        "bold": false,
                        "italics": false,
                        "strikethrough": false,
                        "endpoint": {
                            "type": "NavigationEndpoint",
                            "payload": {
                                "browseId": "UCZGYaSi1FXUP-4WKTRsqDPQ",
                                "browseEndpointContextSupportedConfigs": {
                                    "browseEndpointContextMusicConfig": {
                                        "pageType": "MUSIC_PAGE_TYPE_ARTIST"
                                    }
                                }
                            },
                            "metadata": {
                                "api_url": "/browse"
                            }
                        }
                    }
                ],
                "text": "Asim Azhar",
                "endpoint": {
                    "type": "NavigationEndpoint",
                    "payload": {
                        "browseId": "UCZGYaSi1FXUP-4WKTRsqDPQ",
                        "browseEndpointContextSupportedConfigs": {
                            "browseEndpointContextMusicConfig": {
                                "pageType": "MUSIC_PAGE_TYPE_ARTIST"
                            }
                        }
                    },
                    "metadata": {
                        "api_url": "/browse"
                    }
                }
            },
            "display_priority": "MUSIC_RESPONSIVE_LIST_ITEM_COLUMN_DISPLAY_PRIORITY_HIGH"
        },
        {
            "type": "MusicResponsiveListItemFlexColumn",
            "title": {
                "runs": [
                    {
                        "text": "Habibi",
                        "bold": false,
                        "italics": false,
                        "strikethrough": false,
                        "endpoint": {
                            "type": "NavigationEndpoint",
                            "payload": {
                                "browseId": "MPREb_h2KZ96A0oqd",
                                "browseEndpointContextSupportedConfigs": {
                                    "browseEndpointContextMusicConfig": {
                                        "pageType": "MUSIC_PAGE_TYPE_ALBUM"
                                    }
                                }
                            },
                            "metadata": {
                                "api_url": "/browse"
                            }
                        }
                    }
                ],
                "text": "Habibi",
                "endpoint": {
                    "type": "NavigationEndpoint",
                    "payload": {
                        "browseId": "MPREb_h2KZ96A0oqd",
                        "browseEndpointContextSupportedConfigs": {
                            "browseEndpointContextMusicConfig": {
                                "pageType": "MUSIC_PAGE_TYPE_ALBUM"
                            }
                        }
                    },
                    "metadata": {
                        "api_url": "/browse"
                    }
                }
            },
            "display_priority": "MUSIC_RESPONSIVE_LIST_ITEM_COLUMN_DISPLAY_PRIORITY_MEDIUM"
        }
    ],
 */

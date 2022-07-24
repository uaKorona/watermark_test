import { Context } from "telegraf";
import { Update } from "typegram";
import { MessageTypes } from "./message-types.enum";
import { PhotoSize, Video, Message } from "typegram/message";
import Jimp from "jimp";


class BotHelper {
    private readonly _token: string; //TODO: delete if not needed

    constructor(_token: string) {
        this._token = _token;
    }

    public readonly zero: number = 0;

    public isMessageFromChat( ctx: Context<Update> ): boolean {
        const id = ctx?.chat?.id ?? this.zero;

        return id < this.zero;
    }

    public getFileId( message: Message.PhotoMessage | Message.VideoMessage | unknown ): string | null {
        const photo: PhotoSize[] = (message as Message.PhotoMessage)[MessageTypes.photo] || [];

        if (photo.length) {
            return photo[photo.length - 1].file_id;
        }

        const video: Video = (message as Message.VideoMessage)[MessageTypes.video] || {};

        if (video.file_id) {
            return video.file_id;
        }

        return null;
    }

    public getFile(filePath: string): void {
        console.log( 'filePath', filePath );

        Jimp.read(filePath)
            .then(image => {
                console.log( 'image is got', image.getWidth() );
            })
            .catch(err => {
                console.error( err );
            });
    }
}

export const botHelperCreator = (token: string): BotHelper => new BotHelper(token);

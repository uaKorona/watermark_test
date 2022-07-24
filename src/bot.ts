import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import { MESSAGES } from "./messeges";
import { MessageTypes } from "./message-types.enum";
import { botHelperCreator } from "./bot-helper";

const { WATERMARK_BOT_TOKEN } = process.env;

if (!WATERMARK_BOT_TOKEN) {
    throw new Error('WATERMARK_BOT_TOKEN is not defined!');
}

const botHelper = botHelperCreator(WATERMARK_BOT_TOKEN)

export const bot: Telegraf<Context<Update>> = new Telegraf( WATERMARK_BOT_TOKEN as string );

bot.start( ( ctx ) => {
    ctx.replyWithHTML( MESSAGES.startMessage( ctx.from.first_name ) );
} );

bot.use(async (ctx, next) => {
    if (botHelper.isMessageFromChat( ctx )) {
        // skip running next middlewares for messages from chat
        return;
    }

    return next(); // running next middleware
})

bot.on( [MessageTypes.photo, MessageTypes.video, /*MessageTypes.document*/], async ( ctx ) => {
    // console.log( ctx.message);
    const fileId: string | null = botHelper.getFileId(ctx.message);

    if (fileId) {
        const fileUrl: URL = await bot.telegram.getFileLink(fileId);
        botHelper.getFile(fileUrl.toString())

    } else {
        ctx.replyWithHTML( MESSAGES.unknownFileId(ctx.message) );
    }

} );

bot.use(( ctx ) => {
    ctx.replyWithHTML( MESSAGES.unSupportType() );
});

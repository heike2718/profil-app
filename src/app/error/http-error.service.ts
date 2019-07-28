import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Logger } from '@nsalaun/ng-logger';
import { MessagesService, Message, WARN, ERROR } from 'hewi-ng-lib';
import { SessionService } from '../services/session.service';
import { store } from '../shared/store/app-data';


@Injectable({
	providedIn: 'root'
})
export class HttpErrorService {

	constructor(private messagesService: MessagesService
		, private logger: Logger
		, private sessionService: SessionService) { }


	handleError(error: HttpErrorResponse, context: string) {

		store.updateBlockingIndicator(false);

		if (error instanceof ErrorEvent) {
			this.logger.error(context + ': ErrorEvent occured - ' + JSON.stringify(error));
			throw (error);
		} else {
			switch (error.status) {
				case 0:
					this.messagesService.error('Der Server ist nicht erreichbar.');
					break;
				default:
					const msg = this.extractMessageObject(error);
					if (msg) {
						this.showServerResponseMessage(msg);
					} else {
						if (error.status === 401) {
							this.sessionService.clearSession();
						} else {
							this.messagesService.error('Es ist ein unerwarteter Fehler aufgetreten. Bitte senden Sie eine Mail an info@egladil.de');
						}
					}
			}
		}
	}


	private extractMessageObject(error: HttpErrorResponse): Message {

		if (error['_body']) {
			// so bekommt man den body als nettes kleines JSON-Objekt :)
			const body = JSON.parse(error['_body']);
			if (body['message']) {
				return <Message>body['message'];
			}
		}

		if (error['error']) {
			const err = error['error'];
			return <Message>err['message'];
		}

		return null;
	}

	private showServerResponseMessage(msg: Message) {
		switch (msg.level) {
			case WARN:
				this.messagesService.error(msg.message);
				break;
			case ERROR:
				this.messagesService.error(msg.message);
				break;
			default:
				this.messagesService.error('Unbekanntes message.level ' + msg.level + ' vom Server bekommen.');
		}
	}
}


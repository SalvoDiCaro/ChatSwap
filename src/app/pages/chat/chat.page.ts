import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterContentInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AnimationController, ToastController } from '@ionic/angular';
import { Message } from 'src/app/models/message';
import { CompleteChat } from 'src/app/models/chat';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('target') private content: any;
  chatId: string;
  loggedId: string;
  messageInput: FormControl = new FormControl('');
  currentLanguage: string;
  receiver: Omit<User, 'password'>;
  chat: CompleteChat;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastController: ToastController,
    private storageService: StorageService,
    private animationCtrl: AnimationController
  ) {
    this.chatId = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit() {
    this.currentLanguage = await this.storageService.get<string>('language');
    

    this.loggedId = (
      await this.storageService.get<{ id: string }>('loggedInfo')
    ).id;
    await this.getChat();
    const receiverId =
      this.chat.user1.id === this.loggedId
        ? this.chat.user2.id
        : this.chat.user1.id;
    this.receiver = await this.apiService.getUser(receiverId);

    setInterval(() => {
      this.getChat();
    }, 1000);
  }

  sendMessage = async () => {
    if (!this.messageInput.value) return;
    const receiverId =
      this.chat.user1.id === this.loggedId
        ? this.chat.user2.id
        : this.chat.user1.id;

    const message: Omit<Message, 'id'> = {
      chatId: this.chatId,
      creatorId: this.loggedId,
      receiverId,
      text: this.messageInput.value,
      state: 'sent',
      dateTime: new Date(),
      language: this.currentLanguage,
    };
    try {
      const newMessage = await this.apiService.sendMessage(message);
      this.chat.messages.push(newMessage);
      this.apiService.setChats(await this.apiService.getChatsByUser(this.loggedId));
      this.messageInput.setValue('');
      this.content.scrollToBottom(300);
    } catch (e) {
      console.log(e);
    }
  };

  async errorToastTranslation() {
    const toast = await this.toastController.create({
      message: 'Traduzione non andata a buon fine.',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: "Errore nell'invio del messaggio, riprova.",
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  async errorTranslation() {
    const toast = await this.toastController.create({
      message: 'Lingua di destinazione uguale a quella di origine',
      duration: 2000,
      color: 'warning',
    });
    toast.present();
  }

  userAccount = () => {
    this.router.navigate(['account', this.receiver.id]);
  };

  getChat = async () => {
    try {
      this.chat = await this.apiService.getChat(this.chatId);
      this.chat.messages = this.chat.messages.map((message) => ({
        ...message,
        translated: false,
        textTranslated: '',
      }));
      setTimeout(() => {
        this.content.scrollToBottom(300);
      }, 500);
    } catch (err) {
      console.log(err);
    }
  };

  toggleTranslation = async (message: Message, indexMessage: number) => {
    if (message.textTranslated) {
      const animationStart = this.animationCtrl
        .create()
        .addElement(document.getElementById(message.id))
        .duration(500)
        .iterations(1)
        .easing('ease-out')
        .fromTo('opacity', '1', '0')

        .fromTo('transform', 'translateY(0px)', 'translateY(-15px)');
      await animationStart.play();

      message.translated = !message.translated;
      const animationFinal = this.animationCtrl
        .create()
        .addElement(document.getElementById(message.id))
        .duration(400)
        .iterations(1)
        .easing('ease-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-15px)', 'translateY(0px)');
      await animationFinal.play();
      return;
    }

    const props =
      message.creatorId === this.loggedId
        ? {
            q: message.text,
            target: this.receiver.language,
            source: message.language,
          }
        : {
            q: message.text,
            target: this.currentLanguage,
            source: message.language,
          };

    const animationStart = this.animationCtrl
      .create()
      .addElement(document.getElementById(message.id))
      .duration(400)
      .iterations(1)
      .easing('ease-out')
      .fromTo('opacity', '1', '0')
      .fromTo('transform', 'translateY(0px)', 'translateY(-15px)');
    await animationStart.play();

    console.log('target', props.target);
    console.log('source', props.source);
    if (props.target === props.source) {
      const animationFinal = this.animationCtrl
        .create()
        .addElement(document.getElementById(message.id))
        .duration(500)
        .iterations(1)
        .easing('ease-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-15px)', 'translateY(0px)');
      await animationFinal.play();
      return this.errorTranslation();
    }
    try {
      const translated = await this.apiService.getTranslation(props);
      message.translated = true;
      message.textTranslated = translated;

      const animationFinal = this.animationCtrl
        .create()
        .addElement(document.getElementById(message.id))
        .duration(500)
        .iterations(1)
        .easing('ease-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-15px)', 'translateY(0px)');
      await animationFinal.play();
    } catch (e) {
      this.errorToastTranslation();
      const animationFinal = this.animationCtrl
        .create()
        .addElement(document.getElementById(message.id))
        .duration(500)
        .iterations(1)
        .easing('ease-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-15px)', 'translateY(0px)');
      await animationFinal.play();
    }
  };
}

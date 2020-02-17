import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject, fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

export enum ConnectionStatus {
    Online,
    Offline
}

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private online$: Observable<boolean> = undefined;
    private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Online);

    constructor(public network: Network, public platform: Platform, private toastController: ToastController) {
        this.online$ = Observable.create(observer => {
            observer.next(true);
        }).pipe(mapTo(true));

        this.platform.ready().then(() => {
        if (this.platform.is('cordova')) {
            // on Device
            this.online$ = merge(
                this.network.onConnect().pipe(mapTo(true)),
                this.network.onDisconnect().pipe(mapTo(false))
            );
            this.network.onDisconnect().subscribe(async() => {
                if (this.status.getValue() === ConnectionStatus.Online) {
                    this.updateNetworkStatus(ConnectionStatus.Offline);
                }
            });

            this.network.onConnect().subscribe(async() => {
                if (this.status.getValue() === ConnectionStatus.Offline) {
                    this.updateNetworkStatus(ConnectionStatus.Online);
                }
            });
        } else {
            // on Browser
            this.online$ = merge(
                of(navigator.onLine),
                fromEvent(window, 'online').pipe(mapTo(true)),
                fromEvent(window, 'offline').pipe(mapTo(false))
            );
            fromEvent(window, 'online').subscribe(() => {
                if (this.status.getValue() === ConnectionStatus.Online) {
                    this.updateNetworkStatus(ConnectionStatus.Offline);
                }
            });

            fromEvent(window, 'offline').subscribe(() => {
                if (this.status.getValue() === ConnectionStatus.Offline) {
                    this.updateNetworkStatus(ConnectionStatus.Online);
                }
            });
        }
    });
    }

    public getNetworkType(): string {
        return this.network.type;
    }

    public getNetworkStatus(): Observable<boolean> {
        return this.online$;
    }

    // constructor(private network: Network, private toastController: ToastController, private plt: Platform) {
    //     this.plt.ready().then(() => {
    //         this.initializeNetworkEvents();
    //         const status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
    //         this.status.next(status);
    //     });
    // }

    private async updateNetworkStatus(status: ConnectionStatus) {
        this.status.next(status);

        const connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
        const toast = this.toastController.create({
            message: `You are now ${connection}`,
            duration: 3000,
            position: 'bottom'
        });
        toast.then(val => val.present());
    }

    public onNetworkChange(): Observable<ConnectionStatus> {
        return this.status.asObservable();
    }

    public getCurrentNetworkStatus(): ConnectionStatus {
        return this.status.getValue();
    }
}

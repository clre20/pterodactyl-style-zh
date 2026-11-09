<?php

namespace Pterodactyl\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AddedToServer extends Notification implements ShouldQueue
{
    use Queueable;

    public object $server;

    /**
     * Create a new notification instance.
     */
    public function __construct(array $server)
    {
        $this->server = (object) $server;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->subject(__('You have been added to a server'))
            ->greeting(__('Hello :name!', ['name' => $this->server->user]))
            ->line(__('You have been added as a subuser for the following server, allowing you certain control over the server.'))
            ->line(__('Server Name: :value', ['value' => $this->server->name]))
            ->action(__('Visit Server'), url('/server/' . $this->server->uuidShort));
    }
}

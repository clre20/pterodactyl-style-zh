<?php

namespace Pterodactyl\Notifications;

use Pterodactyl\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AccountCreated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public User $user, public ?string $token = null)
    {
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
        $message = (new MailMessage())
            ->subject(__('Your account has been created'))
            ->greeting(__('Hello :name!', ['name' => $this->user->name]))
            ->line(__('You are receiving this email because an account has been created for you on :app.', ['app' => config('app.name')]))
            ->line(__('Username: :value', ['value' => $this->user->username]))
            ->line(__('Email: :value', ['value' => $this->user->email]));

        if (!is_null($this->token)) {
            return $message->action(__('Setup Your Account'), url('/auth/password/reset/' . $this->token . '?email=' . urlencode($this->user->email)));
        }

        return $message;
    }
}

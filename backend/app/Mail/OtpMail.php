<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $email;
    public $type; // 'register' or 'reset_password'

    public function __construct($otp, $email, $type = 'register')
    {
        $this->otp = $otp;
        $this->email = $email;
        $this->type = $type;
    }

    public function envelope(): Envelope
    {
        $subject = $this->type === 'reset_password' 
            ? 'Reset Password - Jagongan Coffee'
            : 'Kode Verifikasi Email - Jagongan Coffee';

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.otp',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
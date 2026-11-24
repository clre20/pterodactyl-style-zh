@extends('errors.layout')

@section('code', '429')
@section('art', 'rate-limit')
@section('tone', 'red')
@section('title', __('Too many requests'))
@section('message', __('You are sending requests too quickly. Wait a moment and try again.'))

@section('actions')
    <a class="btn btn-primary" href="javascript:location.reload()">{{ __('Try again') }}</a>
@endsection

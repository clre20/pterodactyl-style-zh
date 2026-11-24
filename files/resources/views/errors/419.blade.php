@extends('errors.layout')

@section('code', '419')
@section('art', 'expired')
@section('tone', 'accent')
@section('title', __('Page expired'))
@section('message', __('This page was open for too long. Reload it and try again.'))

@section('actions')
    <a class="btn btn-primary" href="javascript:location.reload()">{{ __('Reload') }}</a>
@endsection

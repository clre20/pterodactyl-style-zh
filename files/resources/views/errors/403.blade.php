@extends('errors.layout')

@section('code', '403')
@section('art', 'lock')
@section('tone', 'red')
@section('title', __('Access denied'))
@section('message', __('You do not have permission to open this page.'))

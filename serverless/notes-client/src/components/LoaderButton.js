import React, { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import { FaSync } from 'react-icons/fa';
import './LoaderButton.css';

export default ({
	isLoading,
	text,
	loadingText,
	className = '',
	disabled = false,
	...props
}) => <Button
	className={`LoaderButton ${className}`}
	disabled={disabled || isLoading}
	{...props}
>
		{isLoading
			? <Fragment><FaSync className="spinning" />{loadingText}</Fragment>
			: text
		}
	</Button> 
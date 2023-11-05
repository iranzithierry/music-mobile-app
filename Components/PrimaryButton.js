import React, { Component } from 'react';
import { TouchableOpacity, ActivityIndicator} from 'react-native';
import { Theme } from '../Theme/Index';

class PrimaryButton extends Component {
    render() {
        const {
            onPress,
            children,
            backgroundColor,
            size = 'medium',
            borderRadius,
            classNameArg,
            disabled,
            showLoader,
            loaderClassName,
            loaderSize = 'small',
            loaderColor = 'white',
            loaderSide = 'right',
        } = this.props;

        const buttonSize = {
            xsmall: 'px-1 py-1',
            small: 'px-3 py-2',
            base: 'px-5 py-2.5',
            large: 'px-5 py-3',
            xlarge: 'px-6 py-3.5',
        }[size] || 'px-5 py-2.5';

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: disabled
                        ? Theme.bgPrimary.disabled
                        : backgroundColor || Theme.bgPrimary.primary,
                }}
                disabled={disabled || false}
                className={`flex flex-row items-center
                        ${showLoader ? 'justify-evenly' : 'justify-center'}
                        ${buttonSize} 
                        ${borderRadius || 'rounded-md'} 
                        ${classNameArg || ''}`
                }
                onPress={onPress}
            >
                {showLoader && loaderSide === 'left' && !disabled && (
                    <ActivityIndicator
                        size={loaderSize}
                        color={loaderColor}
                        style={{ marginRight: 5 }}
                    />
                )}
                {children}
                {showLoader && loaderSide === 'right' && !disabled && (
                    <ActivityIndicator
                        size={loaderSize}
                        color={loaderColor}
                        style={{ marginRight: 5 }}
                    />
                )}
            </TouchableOpacity>
        );
    }
}

export default PrimaryButton;
